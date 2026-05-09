import Billing from "../models/Bilingmodal.js";
import Product from "../models/Productmodal.js";
import Employee from "../models/Empolyeemodal.js";
import Client from "../models/Clientmodal.js";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23, 59, 59, 999
    );

    // ── Daily Bills ──
    const dailyBills = await Billing.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const dailySales = dailyBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const dailyBillCount = dailyBills.length;

    // ── Monthly Bills ──
    const monthlyBills = await Billing.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const monthlySales = monthlyBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const monthlyBillCount = monthlyBills.length;

    // ── Total Bills ──
    const allBills = await Billing.find().sort({ createdAt: -1 }).limit(5);
    const totalBillsCount = await Billing.countDocuments();
    const totalRevenue = await Billing.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // ── Payment Methods Count ──
    const cashBills = await Billing.countDocuments({ paymentMethod: "cash" });
    const cardBills = await Billing.countDocuments({ paymentMethod: "card" });
    const onlineBills = await Billing.countDocuments({ paymentMethod: "online" });

    // ── Products ──
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.find({ stockQuantity: { $lte: 5 } })
      .select("title stockQuantity barcode")
      .limit(5);

    // ── Employees ──
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "Active" });

    // ── Clients ──
    const totalClients = await Client.countDocuments();

    // ── Last 7 days sales (for chart) ──
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const dayBills = await Billing.find({
        createdAt: { $gte: start, $lte: end },
      });
      const dayTotal = dayBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      last7Days.push({
        date: start.toLocaleDateString("en-PK", { weekday: "short" }),
        sales: dayTotal,
        bills: dayBills.length,
      });
    }

    // ── Last 6 months sales (for chart) ──
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() - i + 1,
        0,
        23, 59, 59
      );

      const mBills = await Billing.find({
        createdAt: { $gte: firstDay, $lte: lastDay },
      });
      const mTotal = mBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      last6Months.push({
        month: firstDay.toLocaleDateString("en-PK", { month: "short" }),
        sales: mTotal,
        bills: mBills.length,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        daily: {
          sales: dailySales,
          bills: dailyBillCount,
        },
        monthly: {
          sales: monthlySales,
          bills: monthlyBillCount,
        },
        total: {
          revenue: totalRevenue[0]?.total || 0,
          bills: totalBillsCount,
          products: totalProducts,
          employees: totalEmployees,
          activeEmployees,
          clients: totalClients,
          paymentMethods: {
            cash: cashBills,
            card: cardBills,
            online: onlineBills,
          },
        },
        recentBills: allBills,
        lowStockProducts,
        charts: {
          last7Days,
          last6Months,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};